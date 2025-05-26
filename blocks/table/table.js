// Cloudflare Worker at /api/spreadsheet
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = 20;

    // Normally you would fetch from KV or R2 bucket
    const data = await fetch("https://main--blocksdemo--dimplej.aem.live/sampledata.json").then(res => res.json());

    console.log(data);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = data.slice(start, end);

    return new Response(JSON.stringify({
      page,
      totalPages: Math.ceil(data.length / perPage),
      items: paginated
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
