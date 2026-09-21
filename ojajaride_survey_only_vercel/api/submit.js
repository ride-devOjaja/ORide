const LABELS = {
  q1_consent:'1. Consent to take the anonymous survey', q2_age:'2. Age group', q3_gender:'3. Gender',
  q4_platforms:'4. Platforms driven on', q4_other:'4. Other platform', q5_experience:'5. Ride-hailing experience',
  q6_car:'6. Car ownership / arrangement', q6_other:'6. Other car arrangement', q7_area:'7. Main operating area',
  q7_other:'7. Other operating area', q8_days:'8. Typical days per week on the app', q9_hours:'9. Typical hours online / on the road',
  q10_waiting:'10. Hours spent waiting for trips', q11_traffic:'11. Hours spent stuck in traffic', q12_passenger:'12. Hours spent carrying a passenger',
  q13_after10:'13. Frequency of working after 10pm', q14_timewaste:'14. Biggest time wasters', q14_other:'14. Other time waster',
  q15_fuel:'15. Vehicle fuel type', q15_other:'15. Other fuel type', q16_fuel_day:'16. Typical daily fuel spend',
  q17_fuel_week:'17. Typical weekly fuel spend', q18_scarcity:'18. Fuel scarcity / queue frequency in last 3 months',
  q19_scarcity_actions:'19. Actions taken when fuel is scarce', q19_other:'19. Other scarcity action',
  q20_extra:'20. Extra paid above pump price during scarcity', q21_offline:'21. Frequency of skipping trips due to fuel cost',
  q22_ac_demand:'22a. Passengers insist on AC', q22_ac_fuel:'22b. Extra fuel use from AC', q23_repairs:'23. Who pays for servicing / repairs',
  q24_maintenance:'24. Typical monthly maintenance spend', q25_major_repair:'25. Major repair in last 6 months',
  q25_amount:'25. Major repair amount', q26_costs:'26. Other regular costs', q27_good_gross:'27. Gross earnings on a good day',
  q28_bad_gross:'28. Gross earnings on a bad day', q29_good_takehome:'29. Take-home on a good day', q30_commission:'30. Platform commission feels',
  q31_change:'31. Real take-home vs 6–12 months ago', q32_remit:'32. Remittance to owner (if car is hired)',
  q33_incidents:'33. Security incidents in last 12 months', q34_night_safety:'34. Safety driving at night in Lagos',
  q35_avoid_areas:'35. Areas avoided, especially at night', q36_safety:'36. What would make driving safer', q36_other:'36. Other safety measure',
  q37_cancel_safety:'37. Trip cancelled/rejected mainly for safety', q38_stops:'38. Stops by police/LASTMA/VIO/task force per week',
  q39_stop_events:'39. What usually happens when stopped', q40_official_spend:'40. Weekly unofficial settlements / tips / levies',
  q41_agency:'41. Agency encountered most as a problem', q42_cost:'42. Stops cost more in time, money, or both',
  q43_detained:'43. Arrested/detained/car impounded in last 12 months', q43_details:'43. Details of arrest/detention/impoundment',
  q44_rank_fuel_price:'44. Rank: Fuel price', q44_rank_fuel_scarcity:'44. Rank: Fuel scarcity / queues',
  q44_rank_maintenance:'44. Rank: Vehicle maintenance', q44_rank_commission:'44. Rank: Platform commission / low fares',
  q44_rank_traffic:'44. Rank: Traffic / time on the road', q44_rank_insecurity:'44. Rank: Insecurity / crime',
  q44_rank_officials:'44. Rank: Police / LASTMA / official harassment', q44_rank_fatigue:'44. Rank: Fatigue / long hours',
  q44_rank_accidents:'44. Rank: Accidents / bad roads', q44_rank_other:'44. Rank: Other problem', q44_other_text:'44. Other problem description',
  q45_interest:'45. Interest in lower running-cost service + wallet + safety tools', q46_waitlist:'46. Join EV/CNG pilot waitlist',
  q47_change:'47. One change that would help most in next 6 months', q48_other:'48. Anything else we should know',
  contact_name:'Optional contact: Name', contact_phone:'Optional contact: WhatsApp / phone', contact_lga:'Optional contact: Preferred work LGA'
};

function clean(value) {
  if (Array.isArray(value)) return value.slice(0, 20).map(clean).filter(Boolean);
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, 2500);
}
function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function normalize(body) {
  const out = {};
  for (const key of Object.keys(LABELS)) if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = clean(body[key]);
  return out;
}
function textBody(data, submittedAt) {
  const lines = ['OJAJA RIDE - LAGOS RIDE-HAILING DRIVER SURVEY', `Submitted: ${submittedAt}`, '='.repeat(64)];
  for (const [key,label] of Object.entries(LABELS)) {
    if (!(key in data)) continue;
    const val = Array.isArray(data[key]) ? data[key].join(', ') : data[key];
    if (val !== '') lines.push(`${label}: ${val}`);
  }
  return lines.join('\n');
}
function htmlBody(data, submittedAt) {
  const rows = Object.entries(LABELS).flatMap(([key,label]) => {
    if (!(key in data)) return [];
    const val = Array.isArray(data[key]) ? data[key].join(', ') : data[key];
    if (!val) return [];
    return [`<tr><td style="padding:10px 12px;border-bottom:1px solid #eceaf2;font-weight:700;vertical-align:top;width:46%">${esc(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #eceaf2;vertical-align:top">${esc(val)}</td></tr>`];
  }).join('');
  return `<!doctype html><html><body style="margin:0;background:#f6f7fb;font-family:Arial,sans-serif;color:#1b1e2b"><div style="max-width:760px;margin:24px auto;background:white;border:1px solid #e7e9f1;border-radius:16px;overflow:hidden"><div style="background:#241842;color:white;padding:24px 28px"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#cbb8ff;font-weight:700">OJAJA Ride</div><h1 style="font-size:24px;margin:7px 0 4px">New Driver Survey Response</h1><div style="color:#ded7ed;font-size:14px">Submitted ${esc(submittedAt)}</div></div><table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table></div></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > 120000) return res.status(413).json({ok:false,error:'Submission too large'});

  const body = req.body || {};
  if (body.website) return res.status(200).json({ok:true}); // honeypot
  const started = Number(body._started_at || 0);
  if (started && Date.now() - started < 2500) return res.status(200).json({ok:true});

  const data = normalize(body);
  if (data.q1_consent !== 'Yes') return res.status(400).json({ok:false,error:'Consent is required.'});

  const submittedAt = new Date().toISOString();
  let stored = false;
  let emailed = false;
  const warnings = [];

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const r = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/,'')}/rest/v1/driver_survey_responses`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization':`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer':'return=minimal'
        },
        body:JSON.stringify({submitted_at:submittedAt,responses:data,source:'ojajaride-driver-survey'})
      });
      if (!r.ok) warnings.push(`Database backup failed (${r.status})`); else stored = true;
    } catch { warnings.push('Database backup failed'); }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SURVEY_TO_EMAIL || 'info@ojajaride.com';
  const from = process.env.RESEND_FROM || 'OJAJA Ride Survey <survey@ojajaride.com>';
  if (!apiKey) return res.status(500).json({ok:false,error:'Email service is not configured. Add RESEND_API_KEY in Vercel.',stored,warnings});

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        from,
        to:[to],
        subject:'New OJAJA Ride Driver Survey Response',
        text:textBody(data, submittedAt),
        html:htmlBody(data, submittedAt)
      })
    });
    if (!r.ok) {
      const detail = await r.text();
      return res.status(502).json({ok:false,error:'The survey was received but the email could not be sent.',stored,detail:detail.slice(0,400)});
    }
    emailed = true;
  } catch {
    return res.status(502).json({ok:false,error:'The survey was received but the email service could not be reached.',stored});
  }

  return res.status(200).json({ok:true,emailed,stored,warnings});
}
