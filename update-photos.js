const fs = require('fs');
let content = fs.readFileSync('src/context/KFSContext.tsx', 'utf8');

const updatedRegisterCustomer = `
  const registerCustomer = async (phone: string, password: string, name: string, referralCode?: string, kycPhoto?: string, kycCedula?: string, kycAddress?: string) => {
    const existing = db.customers?.find((c: any) => c.phone === phone);
    if (existing) {
      showToast("Este número de teléfono ya está registrado.", "error");
      return;
    }

    // Upload assets first
    let photoUrl = "";
    let cedulaUrl = "";
    try {
      const { uploadAsset } = await import('./supabase');
      if (kycPhoto) {
        photoUrl = await uploadAsset(\`customers/\${phone}-photo.jpg\`, kycPhoto);
      }
      if (kycCedula) {
        cedulaUrl = await uploadAsset(\`customers/\${phone}-cedula.jpg\`, kycCedula);
      }
    } catch (e) {
      console.warn("Fallo subiendo fotos de KYC:", e);
      photoUrl = kycPhoto || "";
      cedulaUrl = kycCedula || "";
    }

    try {
      const pseudoEmail = \`\${phone}@kfs-user.com\`;
      const { error } = await supabase.auth.signUp({
        email: pseudoEmail,
        password: password,
        options: { data: { full_name: name, role: "customer", phone } }
      });
      if (error) {
        showToast("Error en registro Supabase (Nube): " + error.message, "error");
        return; // Strict cloud-first
      }
    } catch (e: any) {
      showToast("Supabase no configurado o sin conexión: " + e.message, "error");
      return;
    }

    let referred_by_promoter_id = null;
    let referred_by_merchant_id = null;
    let referred_by_customer_id = null;

    if (referralCode) {
      const isPromotora = db.promotoras?.find((p: any) => p.id === referralCode || p.referralCode === referralCode);
      const isMerchant = db.clients?.find((c: any) => c.id === referralCode || c.referralCode === referralCode);
      const isCustomer = db.customers?.find((c: any) => c.id === referralCode || c.referralCode === referralCode);
      
      if (isPromotora) referred_by_promoter_id = isPromotora.id;
      else if (isMerchant) referred_by_merchant_id = isMerchant.id;
      else if (isCustomer) referred_by_customer_id = isCustomer.id;
    }

    const newCustomer = {
      id: \`cust_\${Date.now()}\`,
      phone,
      password: hashPassword(password),
      name,
      real_balance: 0,
      k_points_balance: 0,
      k_points_expiry: null,
      referred_by_promoter_id,
      referred_by_merchant_id,
      referred_by_customer_id,
      kyc_photo: photoUrl,
      kyc_id_card_img: cedulaUrl,
      kyc_address: kycAddress || "",
      kyc_status: "verified",
      createdAt: new Date().toISOString()
    };
`;

content = content.replace(/const registerCustomer = async \(phone: string, password: string, name: string, referralCode\?: string, kycPhoto\?: string, kycCedula\?: string, kycAddress\?: string\) => \{[\s\S]*?kyc_address: kycAddress \|\| "",\s*kyc_status: "verified",\s*createdAt: new Date\(\)\.toISOString\(\)\s*\};/, updatedRegisterCustomer.trim());

fs.writeFileSync('src/context/KFSContext.tsx', content);
