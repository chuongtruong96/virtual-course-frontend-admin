// src/components/Statistics/ExportButton.jsx

import React from 'react';
import { Button } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GetAppIcon from '@mui/icons-material/GetApp';

const ExportButton = ({ chartId, fileName }) => {
  const handleExport = () => {
    const chart = document.getElementById(chartId);
    if (!chart) {
      alert('Không tìm thấy biểu đồ để xuất!');
      return;
    }

    html2canvas(chart).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    }).catch(err => {
      console.error('Error exporting chart:', err);
      alert('Có lỗi xảy ra khi xuất biểu đồ.');
    });
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleExport}
      startIcon={<GetAppIcon />}
      sx={{ mt: 2 }}
    >
      Export as PDF
    </Button>
  );
};

export default ExportButton;
