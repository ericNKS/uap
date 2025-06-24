import mysql from 'mysql2/promise';
import { Database } from '../../../config/database/Database';

export default class ConsultaRepository {
    constructor(
        private db: mysql.Pool = Database
    ) {}
}