
async function crearUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rol = "1";
    const estado = "1";

    const userdata = { username, password, nombre, apellido, rol, estado };

    try {
        const response = await axios.post('http://localhost:4000/createuser', userdata, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data && response.data.message) {
            const data = response.data;
            alert(data.message); 
            console.log(userdata);
            location.reload();
            // return false;
        } else {

            throw new Error('Error al crear usuario');
        }
    } catch (error) {
        console.error(error);
        alert("Complete los campos");
    }
}

async function updateTablaPapelera () {
    try {
        const response = await axios.get('http://localhost:4000/getusers');
        const usuarios = response.data;
    
        const tbody = document.querySelector('#tablaPapelera tbody');
    
        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.username}</td>
                <td>
                    <!--botones de acción-->
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert("Error al obtener los datos");
    }
}
