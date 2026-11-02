const crypto = require("crypto");
const { google } = require("googleapis");
const COOKIE = "devkansh_session";
const SHEET_RANGE = "AppData!A1:B2";
function b64(x){return Buffer.from(x).toString("base64url")}
function sign(payload){const body=b64(JSON.stringify(payload));const sig=crypto.createHmac("sha256",process.env.SESSION_SECRET||"").update(body).digest("base64url");return body+"."+sig}
function verify(token){try{const [body,sig]=String(token||"").split(".");const expected=crypto.createHmac("sha256",process.env.SESSION_SECRET||"").update(body).digest();const got=Buffer.from(sig,"base64url");if(got.length!==expected.length||!crypto.timingSafeEqual(got,expected))return null;const p=JSON.parse(Buffer.from(body,"base64url"));if(p.exp<Date.now())return null;return p}catch{return null}}
function setSession(res,payload){const token=sign({...payload,exp:Date.now()+12*60*60*1000});res.setHeader("Set-Cookie",`${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`)}
function getSession(req){const c=String(req.headers.cookie||"").split(";").map(x=>x.trim());const v=c.find(x=>x.startsWith(COOKIE+"="));return verify(v?decodeURIComponent(v.slice(COOKIE.length+1)):"")}
function clearSession(res){res.setHeader("Set-Cookie",`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`)}
async function auth(){const auth=new google.auth.GoogleAuth({credentials:JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),scopes:["https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive"]});return auth}
async function readDB(){if(!process.env.GOOGLE_SHEET_ID)return {};const a=await auth();const sheets=google.sheets({version:"v4",auth:a});try{const r=await sheets.spreadsheets.values.get({spreadsheetId:process.env.GOOGLE_SHEET_ID,range:SHEET_RANGE});return r.data.values?.[1]?.[1]?JSON.parse(r.data.values[1][1]):{}}catch(e){if(String(e.message).includes("Unable to parse range"))throw e;return {}}}
async function writeDB(db){if(!process.env.GOOGLE_SHEET_ID)throw new Error("GOOGLE_SHEET_ID is not configured");const a=await auth();const sheets=google.sheets({version:"v4",auth:a});await sheets.spreadsheets.values.update({spreadsheetId:process.env.GOOGLE_SHEET_ID,range:SHEET_RANGE,valueInputOption:"RAW",requestBody:{values:[["updated_at","json"],[new Date().toISOString(),JSON.stringify(db)]]}})}
function send(res,status,obj){res.status(status).json(obj)}
module.exports={readDB,writeDB,getSession,setSession,clearSession,send};
