import { createConnection,getManager,getRepository } from "typeorm";
import { UnitVeh } from "../entity/UnitVeh"
import {Veh} from '../entity/Veh';

(async () => {
 createConnection()
let query =getManager(). getRepository(UnitVeh).createQueryBuilder().leftJoin(Veh,'veh', 'unitveh.vehid = veh.id').select()
let vehs = await query.getRawMany()
console.log(vehs)
})()