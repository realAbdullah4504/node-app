document.getElementById('fetchDataBtn').addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      document.getElementById('responseData').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  });
  