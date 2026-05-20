testUtils.createTestButton("Test Registro - Usuario Nuevo", async (btn) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe' + dateNow(), password: '12345' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 201)
        testUtils.setSuccess(btn);
});
testUtils.createTestButton("Test Seguridad - Productor accediendo a Admin", async(btn) =>{
    await okLogin(); 
    const token = localStorage.getItem('test_token');

    const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    const data = await response.json();
    testUtils.log(data);

    if(response.status === 403)
        testUtils.setSuccess(btn);
});

testUtils.createTestButton("Test Eliminar Sample Dinámico", async(btn) => {
    await okLogin();
    const token = localStorage.getItem('test_token');

    //Obtiene los samples del usuario
    const response = await fetch('/api/samples/my-samples', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    // 2. Lógica de evaluación basada en la longitud del arreglo
    if (!data || data.length === 0) {
        testUtils.log("Ingrese un sample primero para poder probar el borrado.");
    } else {
    testUtils.log(`Procediendo a borrar el sample`);
    const sample = data[0]
    const deleteResponse = await fetch(`/api/samples/${sample.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Verificamos el resultado individual de cada operación
    if (deleteResponse.ok) {
       testUtils.log(`Sample con ID ${sample.id} eliminado correctamente.`);
    } else {
        testUtils.log(`Error al eliminar el sample ${sample.id}. Código: ${deleteResponse.status}`);
    }
}
    testUtils.setSuccess(btn);
});
testUtils.createTestButton("Test Subir Sample - Error por Datos Faltantes", async (btn) =>{
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    //se comenta para borrarlo
    //formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.status === 400)
        testUtils.setSuccess(btn);
})