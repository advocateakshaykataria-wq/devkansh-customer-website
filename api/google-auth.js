const {send}=require("./_lib");
module.exports=async(req,res)=>send(res,501,{error:"Google OAuth linking is not used by this deployment. Configure GOOGLE_SERVICE_ACCOUNT_JSON and share the target Sheet/Drive folder with its service-account email."});
