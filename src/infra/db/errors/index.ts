class DatabaseError extends Error {
  type: string;

  constructor(message: string) {
    super(message);
    this.type = 'Database';
    this.message = message;
  }
}

export class AlreadyRegisteredEmailError extends DatabaseError {
  type: string;

  constructor() {
    super('Email already registered in database');
  }
}

export class NoMatchesError extends Error {
  type: string;

  constructor() {
    super('No match found for this query'); ;
  }
}
