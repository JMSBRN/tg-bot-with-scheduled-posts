import { rootClient } from '../../src/api/auth/auth';


const handler = async () => {
    const client =  await rootClient();
    console.log(client);
};

export { handler };