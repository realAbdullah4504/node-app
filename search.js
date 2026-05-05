const API_KEY = "V1XPx1eHtK5LUHAdaZf7ARpJ";

// exa you.com searchapi

async function testSearch() {
  const query = "fever headache"; // example query
  const url = `https://www.searchapi.io/api/v1/search?q=${encodeURIComponent(query)}&engine=google`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("ERROR:", JSON.stringify(errorData, null, 2));
      return;
    }

    const data = await res.json();

    if (!data.organic_results || data.organic_results.length === 0) {
      console.log("No results found");
      return;
    }

    console.log("Top Results:\n");

    data.organic_results.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ${item.link}`);
      console.log(`   ${item.snippet}\n`);
    });

  } catch (err) {
    console.error("Fetch error:", err.message, err.errors);
  }
}

testSearch();
