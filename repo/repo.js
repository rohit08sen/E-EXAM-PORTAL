const fileInput = document.getElementById("fileInput");
const fileList = document.querySelector(".file-list");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    // Create a new file list item
    const fileItem = document.createElement("div");
    fileItem.className = "file-list-item";

    // Create a span for the file name
    const fileName = document.createElement("span");
    fileName.textContent = file.name;

    // Create a button for download
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download";

    // Add download functionality
    downloadBtn.addEventListener("click", () => {
      const url = URL.createObjectURL(file); // Create a temporary URL for the file
      const a = document.createElement("a"); // Create a hidden anchor element
      a.href = url;
      a.download = file.name; // Set the file name for download
      document.body.appendChild(a); // Add the anchor to the DOM
      a.click(); // Programmatically click the anchor
      document.body.removeChild(a); // Remove the anchor from the DOM
      URL.revokeObjectURL(url); // Revoke the temporary URL
    });

    // Append the file name and download button to the file item
    fileItem.appendChild(fileName);
    fileItem.appendChild(downloadBtn);

    // Append the file item to the file list
    fileList.appendChild(fileItem);

    // Clear the file input for new uploads
    fileInput.value = "";
  } else {
    alert("Please select a file to upload.");
  }
});
