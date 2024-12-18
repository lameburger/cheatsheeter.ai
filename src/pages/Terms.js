import React from "react";

const Terms = () => {
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
                Terms and Conditions
            </h1>

            <p>
                Welcome to <strong>Cheatsheeter.com</strong>. By using our platform, you agree to the following terms and conditions. Please read them carefully before using our services.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing or using <strong>Cheatsheeter.com</strong>, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree, please do not use our platform.
            </p>

            <h2>2. User Responsibilities</h2>
            <p>As a user of our platform, you agree to:</p>
            <ul>
                <li>Provide accurate and up-to-date information during registration.</li>
                <li>Use the platform solely for creating, managing, and sharing cheat sheets.</li>
                <li>Refrain from uploading any content that is illegal, offensive, or violates the intellectual property rights of others.</li>
            </ul>

            <h2>3. Ownership of Content</h2>
            <p>
                You retain ownership of any cheat sheets or content you upload to <strong>Cheatsheeter.ai</strong>. By uploading content, you grant us a limited, non-exclusive license to store and display your cheat sheets for the purpose of providing our services.
            </p>

            <h2>4. Restrictions</h2>
            <p>
                You may not use <strong>Cheatsheeter.com</strong> to:
            </p>
            <ul>
                <li>Engage in any activity that disrupts or interferes with the platform.</li>
                <li>Share your account credentials with others.</li>
                <li>Access or attempt to access another user's account or cheat sheets without permission.</li>
            </ul>

            <h2>5. Subscription Plans</h2>
            <p>
                Our platform offers both free and premium subscription plans. Premium users gain access to additional features such as cheat sheet downloads and advanced tools. Subscription fees, if applicable, are non-refundable.
            </p>

            <h2>6. Termination</h2>
            <p>
                We reserve the right to terminate or suspend your account if you violate these terms or engage in any prohibited activities. In the event of termination, you will lose access to all your cheat sheets and associated data.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
                <strong>Cheatsheeter.com</strong> is provided "as is" without any warranties or guarantees. We are not responsible for any loss, damage, or inconvenience caused by your use of the platform.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
                We may update these terms and conditions from time to time. If significant changes are made, we will notify you via email or through our platform. Your continued use of the platform constitutes acceptance of the updated terms.
            </p>

            <h2>9. Governing Law</h2>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising out of or related to these terms will be resolved in [Your Jurisdiction].
            </p>

            <h2>10. Contact Us</h2>
            <p>
                If you have any questions or concerns about these terms, please contact us at <a href="mailto:laneburgett@gmail.com">laneburgett@gmail.com</a>.
            </p>

            <footer style={{ marginTop: "20px", textAlign: "center", fontSize: "0.8rem" }}>
                © {new Date().getFullYear()} Cheatsheeter.com. All rights reserved.
            </footer>
        </div>
    );
};

export default Terms;