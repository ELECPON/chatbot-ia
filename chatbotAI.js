const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['es'], forceNER: true });
const { default_dataset } = require('./restaurar.js');
const entrenar = async(mensaje, respuesta) => {
    if(mensaje != '' && respuesta != ''){
        manager.addDocument('es', mensaje, 'ninguno');
        manager.addAnswer('es', 'ninguno', respuesta);
        await manager.train();
        manager.save('model-es.nlp');
        return 'He aprendido algo nuevo hoy';
    }else{
        return 'No he entendido';
    }
}

const interactuar = async(mensaje) => {
    manager.load('model-es.nlp');
    const response = await manager.process('es', mensaje);
    return response;
}

const restaurar = () =>{
    default_dataset();
}

module.exports = {interactuar, entrenar, restaurar}


