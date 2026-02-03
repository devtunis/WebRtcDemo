import Sqids from 'sqids'

const sqids = new Sqids()
 
const createid = ()=>{
    return   sqids.encode([1, 2, 3])  
}
export default createid