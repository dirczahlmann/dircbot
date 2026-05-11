// ============== ADMIN: Fetch Netlify Form Submissions ==============
// Reads tester signups via Netlify API.
// Requires env vars in Netlify:
//   - NETLIFY_API_TOKEN (Personal Access Token from netlify.com/user/applications)
//   - The function uses SITE_ID which Netlify auto-injects.
//
// Also expects a header "x-admin-pass" matching ADMIN_API_PASS env var.

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pass',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Verify admin password (separate from the JS-visible password)
  const adminPass = event.headers['x-admin-pass'] || event.headers['X-Admin-Pass'];
  const expectedPass = process.env.ADMIN_API_PASS;
  if (!expectedPass) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'ADMIN_API_PASS env var not set on Netlify. Add it in Site Settings → Environment Variables.' })
    };
  }
  if (adminPass !== expectedPass) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  const netlifyToken = process.env.NETLIFY_API_TOKEN;
  if (!netlifyToken) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'NETLIFY_API_TOKEN not configured. Create one at netlify.com/user/applications and add to env vars.' })
    };
  }

  const siteId = process.env.SITE_ID;
  if (!siteId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'SITE_ID not available in function env.' })
    };
  }

  try {
    // Step 1: Fetch all forms on the site
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${netlifyToken}` }
    });
    if (!formsRes.ok) {
      const txt = await formsRes.text();
      return {
        statusCode: formsRes.status,
        headers,
        body: JSON.stringify({ error: 'Netlify API error fetching forms', detail: txt })
      };
    }
    const forms = await formsRes.json();

    // Step 2: For each form, fetch submissions
    const result = [];
    for (const form of forms) {
      const subRes = await fetch(
        `https://api.netlify.com/api/v1/forms/${form.id}/submissions?per_page=100`,
        { headers: { Authorization: `Bearer ${netlifyToken}` } }
      );
      if (subRes.ok) {
        const subs = await subRes.json();
        result.push({
          form_name: form.name,
          form_id: form.id,
          submission_count: subs.length,
          submissions: subs.map(s => ({
            id: s.id,
            created_at: s.created_at,
            data: s.data,
            human_fields: s.human_fields || {}
          }))
        });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        site_id: siteId,
        forms: result
      })
    };
  } catch (err) {
    console.error('Admin submissions error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal error', message: err.message })
    };
  }
};
