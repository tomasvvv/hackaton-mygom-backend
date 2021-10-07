import { create, start } from './server';

create().then(start).catch(error => console.log(error));
