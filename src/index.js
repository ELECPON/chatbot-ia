        const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        let id_field;

        let interactuar = document.getElementById("interactuar"); 
        let mensaje = document.getElementById("mensaje");
        let respuesta = document.getElementById("respuesta");
        let mic = document.getElementById("mic");
        let enviar = document.getElementById("enviar");
        let entrenar = document.getElementById("entrenar");
        let restaurar = document.getElementById("restaurar");
        
        recognition.continuous = true;
        recognition.lang = 'es-ES';
        recognition.interimResult = false;

        function start(){
            recognition.start();
        }

        function stop(){
            recognition.abort();
        }

        
        mic.addEventListener("click", () =>{
            start();
        })

        enviar.addEventListener("click", () => {
            let objeto = {
                mensaje: interactuar.value
            }
            query('http://localhost:3000/enviar', objeto);
        })

        entrenar.addEventListener("click", () => {
            let objeto = {
                mensaje: mensaje.value,
                respuesta: respuesta.value
            }
            query('http://localhost:3000/entrenar', objeto);
        })

        restaurar.addEventListener("click", () => {
            query('http://localhost:3000/restaurar', {});
        })

        function query(url, objeto){
            fetch(url,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(objeto)
            })
            .then(res => res.json())
            .catch(e => console.log(e))
            .then(res => {
                let respuesta = JSON.parse(res);
                hablar(respuesta.respuesta);
            })
        }

        recognition.onresult = (event) => {
            const texto = event.results[event.results.length - 1][0].transcript;
            let item = document.getElementById(id_field);
            item.value = texto;
            if(id_field == "interactuar" && item.value != '')
                document.getElementById('enviar').click();
        }



        document.querySelectorAll('input[type="text"]')
        .forEach(e =>{
            e.addEventListener("click", e => {
               id_field = e.target.id;
               if(id_field == "mensaje" || id_field == "respuesta"){
                    interactuar.value = ''; 
               }else{
                    mensaje.value = '';
                    respuesta.value = '';
               }
            })
        })

        function hablar(result){
            var ssu = new SpeechSynthesisUtterance();
            ssu.text = result;
            ssu.lang = 'es-MX';
            return new Promise((resolve, reject) => {
                ssu.onend = resolve;
                ssu.onerror = reject;
                window.speechSynthesis.speak(ssu);
            });
        }

