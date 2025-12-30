require("dotenv").config();
const mongoose = require("mongoose");
const { AdminModel } = require("@models/admin.model");
const { AdminType } = require("@configs/enums.config");
const { DB_URL } = require("@configs/db.config");

const createSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = DB_URL;
        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB Connected");

        // Check if Super Admin already exists
        const existingSuperAdmin = await AdminModel.findOne({ 
            adminType: AdminType.SUPER_ADMIN 
        });

        if (existingSuperAdmin) {
            console.log("⚠️  Super Admin already exists:");
            console.log(`   ID: ${existingSuperAdmin.adminId}`);
            console.log(`   Email: ${existingSuperAdmin.email}`);
            console.log(`   Phone: ${existingSuperAdmin.fullPhoneNumber}`);
            console.log(`   MongoDB _id: ${existingSuperAdmin._id}`);
            return;
        }

        // Create new Super Admin
        const superAdmin = new AdminModel({
            adminId: "ADM100000",
            email: "superadmin@company.com",
            fullPhoneNumber: "+911234567890",
            adminType: AdminType.SUPER_ADMIN,
            isActive: true,
            supervisorId: null,
            createdBy: "system",
            updatedBy: null
        });

        await superAdmin.save();
        
        console.log("🎉 Super Admin Created Successfully!");
        console.log(`   Admin ID: ${superAdmin.adminId}`);
        console.log(`   Email: ${superAdmin.email}`);
        console.log(`   Phone: ${superAdmin.fullPhoneNumber}`);
        console.log(`   MongoDB _id: ${superAdmin._id}`);
        console.log(`\n📝 Use this MongoDB _id for Bearer token testing:`);
        console.log(`   Authorization: Bearer ${superAdmin._id}`);

    } catch (error) {
        console.error("❌ Error creating Super Admin:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n✅ MongoDB Connection Closed");
        process.exit(0);
    }
};

createSuperAdmin();