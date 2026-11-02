const {getSession,setSession,clearSession,send}=require("./_lib");
module.exports=async(req,res)=>{if(req.method==="GET"){const s=getSession(req);return send(res,200,{authenticated:!!s,role:s?.role||null})}
if(req.method==="DELETE"){clearSession(res);return send(res,200,{ok:true})}
if(req.method!=="POST")return send(res,405,{error:"Method not allowed"});
const {username,password}=req.body||{};
if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_PASSWORD)return send(res,503,{error:"Admin credentials are not configured in Vercel Environment Variables"});
if(username!==process.env.ADMIN_USERNAME||password!==process.env.ADMIN_PASSWORD)return send(res,401,{error:"Invalid admin credentials"});
setSession(res,{role:"admin"});return send(res,200,{ok:true})};
