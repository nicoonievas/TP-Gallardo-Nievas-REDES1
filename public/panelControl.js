function getToken() {
    return localStorage.getItem('token');
}
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

async function updateTablaUsuarios() {
    const token = getToken();
    console.log(token);
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const responseUsuarios = await axios.get('http://localhost:4000/getusers', { headers: headers });
        const usuarios = responseUsuarios.data.registros;

        console.log(usuarios);
        const tbody = document.querySelector('#tablaUsuarios tbody');

        tbody.innerHTML = '';

        usuarios.forEach(async (usuario) => {
            const tr = document.createElement('tr');

            if (usuario.estado) {
                estado = "Desactivar";
            } else {
                estado = "Activar";
            }

            tr.innerHTML = `
                <td>${usuario.username}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>
                    <button onclick="cambiarEstado(${usuario.id}, event)" style="background-color: #4A1FA6; color:white;">${estado}</button>
                </td>
                <td>
                    <select id="selectRoles${usuario.id}" onchange="cambiarRoles(${usuario.id}, this.value)" style="background-color: #4A1FA6; color:white;">
                        ${await getOptionsForSelect(usuario.rol)}
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        alert("Error al obtener los datos");
    }
}

async function getOptionsForSelect(selectedRoleId) {
    let optionsHtml = '';
    const responseRoles = await axios.get('http://localhost:4000/roles');
    const roles = responseRoles.data;

    roles.forEach((rol) => {
        const selected = rol.id === selectedRoleId ? 'selected' : '';
        optionsHtml += `<option value="${rol.id}" ${selected}>${rol.nombrerol}</option>`;
    });

    return optionsHtml;
}


async function cambiarEstado(id, event) {
    event.preventDefault();
    try {
        const confirmacion = confirm('¿Estás seguro de que deseas modificar el estado de este cliente?');
        if (confirmacion) {
            const response = await axios.put('http://localhost:4000/estado/' + id);
            const data = response.data
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error al cambiar el estado");
    }
    updateTablaUsuarios();
}

async function cambiarRoles(id, rol) {
    try {
        const response = await axios.put('http://localhost:4000/roles/' + id, { rol });
        const data = response.data
        alert(data.message);
    } catch (error) {
        console.error(error);
        alert("Error al cambiar el rol");
    }
    updateTablaUsuarios();
}