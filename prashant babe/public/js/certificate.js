// ==========================================================================
// PREPVAULT CERTIFICATE GENERATION CONTROLLER
// HTML5 Canvas Certificate Generator & jsPDF / PNG Export
// ==========================================================================

const Certificate = (() => {
  const render = () => {
    drawCertificateCanvas();
  };

  const drawCertificateCanvas = () => {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const user = App.state.user || window.PREP_SEEDS.users[1];
    const candidateName = (user.name || 'Aarav Sharma').toUpperCase();
    const readinessScore = user.readinessScore || 78;
    const targetRole = user.targetRole || 'Full Stack Software Engineer';
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const certCode = 'PV-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026';

    // Set canvas dimensions
    canvas.width = 1000;
    canvas.height = 700;

    // 1. Background
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Ornate Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#1e3a8a'; // Deep Navy
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d97706'; // Gold accent
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // 3. Header Ribbon / Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('CERTIFICATE OF INTERVIEW READINESS', canvas.width / 2, 110);

    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('ISSUED BY PREPVAULT TALENT & PLACEMENT ENGINE', canvas.width / 2, 140);

    // Decorative line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 120, 160);
    ctx.lineTo(canvas.width / 2 + 120, 160);
    ctx.stroke();

    // 4. Body Text
    ctx.font = '18px Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('This is officially presented to acknowledge that', canvas.width / 2, 220);

    // Candidate Name
    ctx.font = 'bold 44px Inter, serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(candidateName, canvas.width / 2, 280);

    // Description
    ctx.font = '18px Inter, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`has successfully demonstrated professional competency in algorithmic problem solving,`, canvas.width / 2, 340);
    ctx.fillText(`computer science fundamentals, aptitude assessments, and AI mock interviews for:`, canvas.width / 2, 370);

    // Role
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = '#2563eb';
    ctx.fillText(targetRole, canvas.width / 2, 415);

    // 5. Readiness Score Badge
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText(`Verified Readiness Quotient: ${readinessScore}%`, canvas.width / 2, 460);

    // 6. Signatures and Verification
    const yBottom = 580;

    // Left Signature
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, yBottom);
    ctx.lineTo(350, yBottom);
    ctx.stroke();

    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Editorial Director', 250, yBottom + 25);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('PrepVault Assessment Board', 250, yBottom + 45);

    // Right Signature / Date
    ctx.beginPath();
    ctx.moveTo(650, yBottom);
    ctx.lineTo(850, yBottom);
    ctx.stroke();

    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(issueDate, 750, yBottom + 25);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Date of Completion', 750, yBottom + 45);

    // Center Golden Seal
    ctx.beginPath();
    ctx.arc(canvas.width / 2, yBottom - 20, 42, 0, 2 * Math.PI);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('★', canvas.width / 2, yBottom - 10);

    // Verification Hash at bottom
    ctx.font = '11px Consolas, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Certificate ID: ${certCode} | Verify at https://prepvault.io/verify`, canvas.width / 2, 665);
  };

  const downloadCertificatePNG = () => {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `PrepVault_Certificate_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    App.showToast('Certificate PNG downloaded successfully!', 'success');
  };

  const downloadCertificatePDF = () => {
    const canvas = document.getElementById('certificate-canvas');
    if (!canvas) return;

    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [1000, 700]
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
      pdf.save(`PrepVault_Certificate_${Date.now()}.pdf`);
      App.showToast('Certificate PDF generated and downloaded!', 'success');
    } else {
      downloadCertificatePNG();
    }
  };

  return {
    render,
    downloadCertificatePNG,
    downloadCertificatePDF
  };
})();
