
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

async function updateTablaPapelera() {
    try {
        const response = await axios.get('http://localhost:4000/getusers');
        const usuarios = response.data.registros; 
        
        console.log(usuarios);
        const tbody = document.querySelector('#tablaPapelera tbody');
        
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.username}</td>
                <td>
                <button onclick="cambiarEstado(${usuario.id}, event)" style="background-color: #4A1FA6; color:white;">Activar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert("Error al obtener los datos");
    }
}


async function cambiarEstado(id, event) {
    event.preventDefault();
    try {
        const confirmacion = confirm('¿Estás seguro de que deseas modificar el estado de este cliente?');
        if (confirmacion) {
            const response = await axios.put('http://localhost:4000/estado' + '/' + id);
            const data = response.data
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error al cambiar el estado");
    }
    location.reload();
}