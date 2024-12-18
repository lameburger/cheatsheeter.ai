import React from "react";

const PrivacyPolicy = () => {
    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                maxWidth: "800px",
                margin: "0 auto",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                Privacy Policy
            </h1>
            <p>
                At <strong>Cheatsheeter.com</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your data when you use our services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
                We only collect cheat sheet data that you create and upload to our platform. This includes the content of your cheat sheets, as well as metadata such as:
            </p>
            <ul>
                <li>Your user ID (used for associating cheat sheets with your account).</li>
                <li>Details you provide about your cheat sheets (e.g., school, class, test info).</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
                The cheat sheet data you provide is used solely to enable our platform's functionality. Specifically, we use this data to:
            </p>
            <ul>
                <li>Allow you to view, edit, and download your cheat sheets.</li>
                <li>Provide you with a personalized experience based on your account.</li>
            </ul>

            <h2>3. Data Sharing</h2>
            <p>
                We do not sell, share, or distribute your data to third parties. Your cheat sheet data remains private and is accessible only to you.
            </p>

            <h2>4. Data Storage</h2>
            <p>
                Your cheat sheet data is securely stored in our database. We take appropriate measures to protect your data from unauthorized access, modification, or deletion.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Access your cheat sheet data through your account.</li>
                <li>Delete any cheat sheets you've created.</li>
                <li>Request the removal of all your data from our platform by contacting support.</li>
            </ul>

            <h2>6. Updates to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time to reflect changes to our services or legal requirements. If any significant changes are made, we will notify you through our platform or via email.
            </p>

            <h2>7. Contact Us</h2>
            <p>
                If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:laneburgett@gmail.com">laneburgett@gmail.com</a>.
            </p>

            <footer style={{ marginTop: "20px", textAlign: "center", fontSize: "0.8rem" }}>
                © {new Date().getFullYear()} Cheatsheeter.com. All rights reserved.
            </footer>
        </div>
    );
};

export default PrivacyPolicy;