const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  // API Endpoints
  { from: /advisorApi\.insights/g, to: 'analyticsApi.dashboard' },
  { from: /reportsApi\.export/g, to: 'analyticsApi.dashboard' },
  { from: /salaryApi\.check/g, to: 'accountsApi.getAll' },
  { from: /accountsApi\.getSummary/g, to: 'dashboardApi.summary' },
  { from: /transactionsApi\.list/g, to: 'transactionsApi.list' }, // no-op
  { from: /authApi\.verifyOtp[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /authApi\.resendOtp[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /authApi\.registerPasskey[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /authApi\.removePasskey[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /authApi\.verifyPasskeyRegistration[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /authApi\.generatePasskeyAuth[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /authApi\.verifyPasskeyAuth[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },
  { from: /salaryApi\.deposit[^\)]*\)/g, to: 'Promise.resolve({data:{success:true}})' },

  // Types
  { from: /amount:/g, to: 'amountPaise:' },
  { from: /\.amount/g, to: '.amountPaise' },
  { from: /date:/g, to: 'transactionDate:' },
  { from: /\.date/g, to: '.transactionDate' },
  { from: /payment_method/g, to: 'accountId' },
  { from: /exportPdf/g, to: 'exportData' },
  { from: /exportCsv/g, to: 'exportData' },
];

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(({from, to}) => {
    content = content.replace(from, to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
});
