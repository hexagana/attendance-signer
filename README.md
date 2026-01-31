# Attendance Signature Portal

A web-based application for participants to sign attendance PDF documents stored in SharePoint/OneDrive.

## Features

- **Microsoft Authentication**: Secure sign-in using Microsoft account
- **Dynamic Participant List**: Automatically loads PDF files from your SharePoint folder
- **Touch-Friendly Signature**: Draw signatures using finger or stylus on mobile devices
- **Automatic Save**: Signatures are saved directly back to the original PDF in SharePoint/OneDrive

## Setup Instructions

### 1. Azure App Registration (Already Done)

Your Azure App has been configured with:
- **Client ID**: `aec5d54c-af0f-4312-85bf-59eadb83b008`
- **Tenant ID**: `095a44f7-c3d6-450a-9455-0b4de9a28c1c`
- **Redirect URI**: `https://hexagana.github.io/attendance-signer/`

### 2. Deploy to GitHub Pages

1. Create a new repository named `attendance-signer` on GitHub
2. Upload the `index.html` file to the repository
3. Enable GitHub Pages in Settings > Pages > Source: `main` branch

### 3. Usage

#### For Administrators (You)

1. Prepare attendance PDFs named after each participant (e.g., `John Doe.pdf`, `Jane Smith.pdf`)
2. Upload PDFs to a SharePoint/OneDrive folder
3. Get the sharing link for the folder
4. Share this link with participants: `https://hexagana.github.io/attendance-signer/`

#### For Participants

1. Visit the link shared by administrator
2. Paste the SharePoint folder link (provided by administrator)
3. Click "Sign In with Microsoft" and authenticate
4. Find and click on their name
5. Draw their signature using finger/stylus
6. Click "Save Signature"

## File Naming Convention

PDF files should be named exactly as the participant's name appears:
- `Iqbal Bin Sanjiman.pdf`
- `Ahmad Tan Wei Ming.pdf`
- `Sarah Lee.pdf`

The display name shown to participants will be the filename without the `.pdf` extension.

## Signature Placement

The signature is automatically placed in the "Candidate:" signature box on the PDF document (right side, near the bottom of the page).

## Troubleshooting

### "Access Denied" Error
- Ensure participants have access to the SharePoint folder
- Check that the folder sharing link is correct

### Signature Not Appearing
- Make sure to draw a visible signature before saving
- Wait for the "Signature saved successfully" message

### PDF Not Loading
- Verify the file is a valid PDF
- Check internet connection

## Technical Details

- **Authentication**: Microsoft Authentication Library (MSAL.js)
- **PDF Rendering**: PDF.js
- **PDF Modification**: pdf-lib
- **Signature Capture**: Signature Pad

## Browser Support

- Chrome (recommended)
- Safari
- Firefox
- Edge

Works best on mobile devices for finger signature input.
