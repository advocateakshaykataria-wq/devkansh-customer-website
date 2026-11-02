const {readDB,writeDB,getSession,send}=require("./_lib");
module.exports=async(req,res)=>{if(getSession(req)?.role!=="admin")return send(res,401,{error:"Admin login required"});
try{if(req.method==="GET")return send(res,200,await readDB());if(req.method==="PUT"){await writeDB(req.body||{});return send(res,200,{ok:true})}return send(res,405,{error:"Method not allowed"})}catch(e){return send(res,500,{error:e.message||"Data service error"})}};
