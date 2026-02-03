export default class Quee{
    
    constructor(){
       
        this.k  = new Set()
        this.v  = new Map()
        this.c = new Map()
   }

    addChannel(key,value){
        this.c.set(key,value)
    }
    deleteKeyChannel(key){
        this.c.delete(key)
    }


    HasRelation(id){
        return this.v.has(id)?this.v.get(id): false
    }


   AddCouple(key,value){
    this.v.set(key,value)
    this.v.set(value,key)
    
   } 
   DelteCouple(key,value){
    this.v.delete(value)
    this.v.delete(key)
 
    
   }
   AddItem(key){
    this.k.add(key)
   }
   display(){
    //console.log(this.k)
    //console.log(this.v)
    console.log(this.c)
   }
   delete(id){
    this.k.delete(id)
    
   }
   bringIce(passer){
    for(const value of this.k){
        if(value!=passer){
            return value
        }
       }
       return null
   }
}