const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        let id_field;

        recognition.continuous = true;
        recognition.lang = 'es-ES';
        recognition.interimResult = false;

        function start(){
            recognition.start();
        }

        function stop(){
            recognition.abort();
        }

        document.getElementById("mic")
        .addEventListener("click", () =>{
            start();
        })

        document.getElementById("enviar")
        .addEventListener("click", () => {
            let objeto = {
                mensaje: document.getElementById('interactuar').value
            }
            query('http://localhost:3000/enviar', objeto);
        })

        document.getElementById("entrenar")
        .addEventListener("click", () => {
            let objeto = {
                mensaje: document.getElementById('mensaje').value,
                respuesta: document.getElementById('respuesta').value
            }
            query('http://localhost:3000/entrenar', objeto);
        })

        document.getElementById("restaurar")
        .addEventListener("click", () => {
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
            document.getElementById(id_field).value = texto;
            document.getElementById('enviar').click();
        }

        document.querySelectorAll('input[type="text"]')
        .forEach(e =>{
            e.addEventListener("click", e => {
               id_field = e.target.id;
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

