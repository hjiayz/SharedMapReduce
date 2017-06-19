"use strict"
let cpus = navigator.hardwareConcurrency||8;
//let cpus = 16;
class Pool{
  constructor(func,onmsg){
    this.queue=[];
    this.counter=1;
    let arr = ["var cpus=",cpus,";var f=", func.toString(),";var onmsg=",onmsg.toString(), ";onmessage=function(e){onmsg(e,cpus,f,postMessage);}"];
    let f, freeURL;
    f = window.URL.createObjectURL(new Blob(arr, { type: "application/javascript" }));
    freeURL = window.URL.revokeObjectURL;
    this.pool = new Array(cpus);
    for (let i = 0; i < cpus; i++) {
      let w=new Worker(f);
      let self=this;
      w.onmessage=function(){
        if (self.counter===1){
          self.cb();
          if (self.queue.length>0){
            let next=self.queue.shift();
            self.sendall(...next);
          }
        }
        else 
          self.counter--;
      }
      w.onerror=function(err){
        self.err(err);
      }
      this.pool[i]=w;
    }
    freeURL(f);
  }
  sendall(data,transfers,cb,err){
    this.counter=cpus;
    this.cb=cb;
    this.err=err;
    for(let i=0;i<this.pool.length;i++){
      let w=this.pool[i];
      w.postMessage(data.concat(i),transfers);
      w.onerror=err;
    }
  }
  run(data,transfers,cb,err){
    if ((this.counter===1)) {
      this.sendall(data,transfers,cb,err);
    }
    else{
      this.queue.push([data,transfers,cb,err]);
    }
  }
  free(){
    for(let w of this.pool){
      w.terminate();
    }
  }
}

export default class SharedMapReduce {
  constructor(array){
    this.data=array;
  }
  map(compiledfunc){
    let self=this;
    return new Promise(function (resolve, reject) {
      let output=new self.data.constructor(new SharedArrayBuffer(self.data.buffer.byteLength));
      let cb=()=>resolve(output);
      compiledfunc.run([self.data,output],[self.data.buffer,output.buffer],cb,reject);
    });
  }
  reduce(compiledfunc){
    let self=this;
    return new Promise(function (resolve, reject) {
      let output=new self.data.constructor(new SharedArrayBuffer(cpus*self.data.BYTES_PER_ELEMENT));
      let status=new Int32Array(new SharedArrayBuffer(cpus<<1));
      //status.fill(0);
      let cb=()=>resolve(output[0]);
      compiledfunc.run([self.data,output,status],[self.data.buffer,output.buffer,status.buffer],cb,reject);
    });
  }
  mapreduce(compiledfuncmapfunc,compiledfuncreducefunc,init){
    let self=this;
    return new Promise(function(resolve,reject){
      self.map(compiledfuncmapfunc)
        .then(function(done){
          let data=new SharedMapReduce(done);
          data.reduce(compiledfuncreducefunc)
            .then(function(done){
              resolve(done)
            })
            .catch(function(err){reject(err);});
        })
        .catch(function(err){reject(err);});
    });
  }
  static mapf(f){
    return new Pool(f,
      function(e,cpus,f,pm){
        let d=e.data;
        
        let id=d[2];
        let input=d[0];
        let output=d[1];
        let l=input.length;
        for(let i=id;i<l;i+=cpus){
          output[i]=f(input[i],i,input);
        }
        pm(0);
      }
    );
  }
  static reducef(f){
    return new Pool(f,
      function(e,cpus,f,pm){
        let d=e.data;
        let id=d[3];
        let input=d[0];
        let output=d[1];
        let l=input.length;
        let status=d[2];
        let t=cpus;
        let tid=id;
        output[id]=input[id];
        for(let i=id+t;i<l;i+=t){
          output[id]=f(output[id],input[i]);
        }
        t=t>>1;
        for(let i=0;t>0;i++,t=t>>1){
          if (id>=t) id-=t;
          //console.log("tid:",tid,"id:",id,i,t,output,status);
          let low=((2<<i)-1);
          if (((Atomics.or(status,id,1<<i))&low)!=low) break;
          output[id]=f(output[id],output[id+t]);
          //console.log("tid:",tid,"id:",id,i,t,"add:",id,id+t);
        }
        pm(0);
      }
    );
  }
}