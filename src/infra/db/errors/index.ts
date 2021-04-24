export class AlreadyRegisteredEmailError extends Error {
    type: string;

    constructor(){
        super('Email already registered in database');
        this.type = 'Database'
        this.message = 'Email already registered in database';
    }
}