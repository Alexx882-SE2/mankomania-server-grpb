const db = require('../database.js');

module.exports = class Session{

    constructor(data){
        this.id = data.id;
        this.userid = data.userid;
        this.lobbyid = data.lobbyid;
        this.color = data.color|| null;
        this.currentposition = data.currentposition;
        this.balance = data.balance;
        this.amountkvshares = data.amountkvshares;
        this.amounttshares = data.amounttshares;
        this.amountbshares = data.amountbshares;
        this.isplayersturn = data.isplayersturn;
    }

    // fixme are you escaping manual sql statement parameters?
    static async getAllByUserID(userId){
        try {
            const result = await db.query('SELECT * FROM session where userid = $1', [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async initializeSession(session){
        try {
            const result = await db.query(
                'INSERT INTO session (id, userid, lobbyid, color, currentposition, balance, amountkvshares, amounttshares, amountbshares, isplayersturn) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [session.userid, session.lobbyid, null, 1, 1000000, 10, 10, 10, session.isplayersturn]
            );          
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async setColor(session){
        try {
            let startingField = 0; 
            switch(session.color){
                case 'red':
                    startingField = 52;
                    break;
                case 'blue':    
                    startingField = 49;
                    break;
                case 'green':
                    startingField = 50;
                    break;
                case 'lila':
                    startingField = 51;
                    break;
                default:
                    startingField = 0;
            }
            const result = await db.query('UPDATE session SET color = $1, currentposition = $2 WHERE userid = $3 AND lobbyid = $4', [session.color, startingField, session.userid, session.lobbyid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // fixme return boolean instead of the rows and rename the method to clarify
    static async alreadyJoined(userId, lobbyId){
        try {
            const result = await db.query('SELECT * FROM session WHERE userid = $1 AND lobbyid = $2', [userId, lobbyId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getUnavailableColors(lobbyId){
        try {
            const result = await db.query('SELECT color FROM session WHERE lobbyid = $1', [lobbyId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    
    static async getAllUsersByLobbyID(lobbyId){
        try {
            const result = await db.query('SELECT u.userid, u.email, s.color, s.currentposition, s.balance, s.isPlayersTurn FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;', [lobbyId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async countUsersByLobbyID(lobbyId){
        try {
            const result = await db.query('SELECT COUNT(u.userid) FROM users u JOIN session s ON u.userid = s.userid WHERE s.lobbyid = $1;', [lobbyId]);
            if (result.rows.length > 0) {
                return result.rows[0].count;
            } else {
                return null; 
            }
        } catch (error) {
            throw error;
        }
    }

    static async getMaxAmountOfUsersByLobbyID(lobbyId){
        try {
            const result = await db.query('SELECT maxplayers FROM lobby WHERE id = $1;', [lobbyId]);
            if (result.rows.length > 0) {
                return result.rows[0].maxplayers;
            } else {
                return null; 
            }
        } catch (error) {
            throw error;
        }
    }

    static async setPosition(session){
        try {
            const result = await db.query('UPDATE session SET currentposition = $1 WHERE userid = $2 AND lobbyid = $3', [session.currentposition, session.userid, session.lobbyid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async setIsPlayerTurn(session){
        try {
            const result = await db.query('UPDATE session SET isPlayersTurn = $1 WHERE userid = $2 AND lobbyid = $3', [session.isplayersturn, session.userid, session.lobbyid]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getEffectOfField(session){
        try {
            const result = await db.query('SELECT effect FROM field WHERE id = $1', [session.currentposition]);
            if (result.rows.length > 0) {
                return result.rows[0].effect;
            } else {
                return null; 
            }
        } catch (error) {
            throw error;
        }
    }

    static async getBalance(session){
        try {
            const result = await db.query('SELECT balance FROM session WHERE userid = $1 AND lobbyid = $2', [session.userid, session.lobbyid]);
            if (result.rows.length > 0) {
                return result.rows[0].balance;
            } else {
                return null; 
            }
        } catch (error) {
            throw error;
        }
    }

    static async updateBalance(session, newBalance){
        try {
            const result = await db.query('UPDATE session SET balance = $1 WHERE userid = $2 AND lobbyid = $3', [newBalance, session.userid, session.lobbyid]);
            return result.rows;
        }catch (error) {
            throw error;
        }
    }
}