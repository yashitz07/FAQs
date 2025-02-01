const express = require("express");
const router = express.Router();
const FAQ = require("../models/faq");
const redisClient = require("../redisClient");

router.get("/", async (req, res) => {
    try {
        let lang = req.query.lang || "en";
        let cacheKey = `faqs:${lang}`;

        // cache hua
        let cachedFAQs = await redisClient.get(cacheKey);
        let fromCache = false;
        let faqs;

        if (cachedFAQs) {
            console.log("Serving from cache");
            faqs = JSON.parse(cachedFAQs);
            fromCache = true;
        } else {
            faqs = await FAQ.find();
            faqs = faqs.map(faq => ({
                id: faq._id,
                question: faq.getTranslation(lang),
                answer: faq.answer
            }));

            // Store in Redis
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(faqs));
        }

        res.render("admin/index", { faqs, fromCache });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/redis-status", async (req, res) => {
    try {
        await redisClient.ping();
        res.json({ status: "OK" });
    } catch (err) {
        res.json({ status: "Not Connected", error: err.message });
    }
});


router.get("/translations/:id", async (req, res) => {
    try {
        let faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ error: "FAQ not found" });

        res.json({
            en: faq.question,
            hi: faq.translations.get("hi") || "No translation",
            gu: faq.translations.get("gu") || "No translation",
            bn: faq.translations.get("bn") || "No translation",
            mr: faq.translations.get("mr") || "No translation",
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { question, translations, answer } = req.body;
        const faq = new FAQ({
            question,
            translations: new Map(Object.entries(translations)),
            answer
        });

        await faq.save();

        // Clear 
        await redisClient.del("faqs:en");
        await redisClient.del("faqs:hi");
        await redisClient.del("faqs:gj");
        await redisClient.del("faqs:bn");

        res.redirect("/admin");  //
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ message: "FAQ deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
