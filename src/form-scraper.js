const { chromium } = require('playwright');

async function fillForm() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const formData = {
    nombre: "Juan",
    apellido: "Pérez", 
    email: "juan.perez@empresa.com",
    empresa: "Tech Corp",
    web: "https://techcorp.com"
  };

  try {
    console.log('Loading page...');
    await page.goto('https://ateitiscorp.com/inscripcion_openbash/');
    
    console.log('Analyzing form structure...');
    const formFields = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="url"]');
      const fields = [];
      
      inputs.forEach(input => {
        const name = input.name || input.id || input.placeholder || '';
        fields.push({
          selector: input.name ? `input[name="${input.name}"]` : 
                   input.id ? `input[id="${input.id}"]` : 
                   input.placeholder ? `input[placeholder="${input.placeholder}"]` : '',
          name: name.toLowerCase(),
          type: input.type
        });
      });
      
      return fields;
    });
    
    console.log('Found form fields:', formFields);
    
    for (const field of formFields) {
      const fieldName = field.name;
      if (formData[fieldName]) {
        console.log(`Filling ${fieldName}: ${formData[fieldName]}`);
        await page.fill(field.selector, formData[fieldName]);
      }
    }
    
    console.log('Submitting form...');
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Enviar"), button:has-text("Submit"), button:has-text("Send")');
    
    console.log('Form submitted successfully');
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('Error filling form:', error);
  } finally {
    await browser.close();
  }
}

fillForm();
