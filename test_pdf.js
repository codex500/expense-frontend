import { jsPDF } from 'jspdf';
try {
  const doc = new jsPDF({
    encryption: {
      userPassword: 'password',
      ownerPassword: 'password',
      userPermissions: ['print', 'copy']
    }
  });
  doc.text('Hello', 10, 10);
  doc.save('test.pdf');
  console.log('PDF saved successfully');
} catch (e) {
  console.error('Error:', e);
}
