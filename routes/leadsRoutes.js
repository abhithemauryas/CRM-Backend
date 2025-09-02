const express = require("express");
const leadModel = require("../models/lead.model");
const authenticateToken = require("../middleware/authMiddleware");
const leadsRouter = express.Router();
// multer for export excell sheet 
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
// const XLSX = require("xlsx");
// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // create this folder if not exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

leadsRouter.post("/lead/import-excel", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Format and insert leads
    const formattedLeads = data.map((item) => ({
      status: item.status || "new",
      source: item.source || "others",
      visibility: item.visibility || "private",
      tags: typeof item.tags === "string"
        ? item.tags.split(",").map(t => t.trim())
        : Array.isArray(item.tags) ? item.tags : [],
      assigned: typeof item.assigned === "string"
        ? item.assigned.split(",").map(a => a.trim())
        : Array.isArray(item.assigned) ? item.assigned : [],
      groups: item.groups || "",

      name: item.name,
      email: item.email,
      phone: item.phone,
      company: item.company,
      website: item.website,
      address: item.address,
      description: item.description,
      country: item.country,
      state: item.state,
      citys: item.citys
    }));
    // console.log("formattedLeadssssssssssssss", formattedLeads)

    const insertedLeads = await leadModel.insertMany(formattedLeads);

    res.status(200).send({
      message: `${insertedLeads.length} leads imported successfully`,
      leads: insertedLeads,

    });
    // console.log("lead dataaaaaaaaaaaaaaaaaa",insertedLeads)
  } catch (error) {
    console.error("❌ Error importing leads:", error);
    res.status(500).send({ message: "Error while importing leads" });
  }
});

const XLSX = require("xlsx");

leadsRouter.get("/lead/download-template", async (req, res) => {
  try {
    // Step 1: Main header structure (matches your schema)
    const headers = [
      {
        name: "",
        email: "",
        phone: "",
        company: "",
        designation: "",
        website: "",
        vat: "",
        address: "",
        description: "",
        country: "",
        state: "",
        citys: "",
        status: "",
        source: "",
        visibility: "",
        tags: "",
        assigned: "",
        groups: "",
      },
    ];

    // Step 2: Create worksheet from headers
    const worksheet = XLSX.utils.json_to_sheet(headers);

    // Step 3: Create dropdown options sheet
    const dropdownOptions = {
      A1: { v: "Status" },
      A2: { v: "new" },
      A3: { v: "connect" },
      A4: { v: "working" },
      A5: { v: "qualified" },
      A6: { v: "declined" },
      A7: { v: "customer" },

      B1: { v: "Source" },
      B2: { v: "facebook" },
      B3: { v: "twitter" },
      B4: { v: "instagream" },
      B5: { v: "linkedin" },
      B6: { v: "searchEngine" },
      B7: { v: "others" },

      C1: { v: "Visibility" },
      C2: { v: "public" },
      C3: { v: "private" },
      C4: { v: "personal" },
      C5: { v: "customs" },

      D1: { v: "Tags" },
      D2: { v: "vip" },
      D3: { v: "bugs" },
      D4: { v: "team" },
      D5: { v: "updates" },
      D6: { v: "personal" },
      D7: { v: "promotions" },
      D8: { v: "high-budget" },
      D9: { v: "customs" },
      D10: { v: "low-budget" },
      D11: { v: "wholesale" },
      D12: { v: "primary" },

      E1: { v: "Groups" },
      E2: { v: "group-a" },
      E3: { v: "group-b" },
      E4: { v: "group-c" },
      E5: { v: "group-d" },
      E6: { v: "group-e" },
      E7: { v: "group-f" },
      E8: { v: "group-g" },
      E9: { v: "group-h" },
      E10: { v: "group-i" },
      E11: { v: "group-j" },
      E12: { v: "group-k" },
    };

    const dropdownSheet = {
      "!ref": "A1:E12",
      ...dropdownOptions,
    };

    // Step 4: Create workbook and append both sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads Template");
    XLSX.utils.book_append_sheet(workbook, dropdownSheet, "DropdownOptions");

    // Step 5: Write workbook to buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Step 6: Send file as download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lead_template.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error downloading template:", error);
    res.status(500).json({ message: "Error generating Excel template." });
  }
});

leadsRouter.post("/lead/create", authenticateToken, async (req, res) => {
  const {
    status, source, visibility, tags, assigned, groups,
    name,
    email,
    phone,
    company,
    website,
    address,
    description,
    country, state, citys
  } = req.body;
  //  console.log("🧠 Authenticated User ID:", req.user._id);
  try {
    const newLead = new leadModel({
      status, source, visibility, tags, assigned, groups,
      name,
      email,
      phone,
      company,
      website,
      address,
      description, country, state, citys
      // createdBy: req.user._id

    });

    await newLead.save();
    await newLead.populate("createdBy", "name email");
    await newLead.populate("assigned", "name email");
    res.status(201).send({
      message: "Lead created successfully",
      lead: newLead
    });
  } catch (error) {
    console.error("❌ Error creating lead:", error);
    res.status(500).send({ message: "Server error during lead creation" });
  }
})

leadsRouter.get("/lead/all", async (req, res) => {
  try {
    const leads = await leadModel.find().populate("createdBy", "name email").populate("assigned", "name email"); // 👈 add this
    res.status(200).send({ message: "Leads fetched successfully", leads });
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    res.status(500).send({ message: "Server error during fetching leads" });

  }
})

leadsRouter.get("/lead/options", async (req, res) => {
  try {
    const leads = await leadModel.find().select('name email');
    res.status(200).send({ message: "Leads fetched successfully", leads });
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    res.status(500).send({ message: "Server error during fetching leads" });

  }
})

leadsRouter.get("/lead/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await leadModel.findById(id).populate("createdBy", "name email")
      .populate("assigned", "name email")
      .lean(); // 👈 lean added
    if (!lead) {
      return res.status(404).send({ message: "Lead not found" });
    }
    res.status(200).send({ message: "Lead fetched successfully", lead });
  } catch (error) {
    console.error("❌ Error finding single lead:", error);
    res.status(500).send({ message: "Server error during lead update" });
  }
});

leadsRouter.get("/lead-status/:id/:stat", async (req, res) => {
  const { id, stat: status } = req.params;
  try {

    const lead = await leadModel.findById(id).lean(); // 👈 lean added
    if (!lead) {
      return res.status(404).send({ message: "Lead not found" });
    }
    console.log(status)
    await leadModel.findByIdAndUpdate(id, {
      status
    })
    res.status(200).send({ message: "Lead fetched successfully", lead });

  } catch (error) {
    console.error("❌ Error finding single lead:", error);
    res.status(500).send({ message: "Server error during lead update" });
  }

});



leadsRouter.put("/lead/update/:id", authenticateToken, async (req, res) => {
  const { id } = req.params
  const { status, source, visibility, tags, assigned, groups, name, email, phone, company, website, address, description, country, state, citys } = req.body;
  try {
    const updatedLead = await leadModel.findByIdAndUpdate(id, {
      status, source, visibility, tags, assigned, groups,
      name,
      email,
      phone,
      company,
      website,
      address,
      description, country, state, citys,
      createdBy: req.user._id
    }, { new: true });
    res.status(200).send({
      message: "Lead updated successfully",
      lead: updatedLead
    });
  } catch (error) {
    console.error("❌ Error updating lead:", error);
    res.status(500).send({ message: "Server error during lead update" });
  }

})
leadsRouter.delete("/lead/delete/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLead = await leadModel.findByIdAndDelete(id);
    if (!deletedLead) {
      return res.status(404).send({ message: "Lead not found" });
    }
    res.status(200).send({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting lead:", error);
    res.status(500).send({ message: "Server error during lead deletion" });
  }

})




module.exports = leadsRouter;