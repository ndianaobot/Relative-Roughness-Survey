document.addEventListener('DOMContentLoaded', () => {
    const consentModal = document.getElementById('consent-modal');
    const consentCheckbox = document.getElementById('consent-checkbox');
    const continueButton = document.getElementById('continue-button');
    const surveyContent = document.getElementById('survey-content');
    const getMoreImagesButton = document.getElementById('get-more-images');
    const submitRankingsButton = document.getElementById('submit-rankings');
    const validationMessages = document.getElementById('validation-messages');
    const successMessage = document.getElementById('success-message');

    // Create an Audio object for the success sound
    // IMPORTANT: You need to place a file named 'success.mp3' in your project's root directory.
    // If your file is elsewhere, update the path accordingly (e.g., 'audio/success.mp3').
    const successSound = new Audio('success.mp3'); 

    const imageElements = [
        document.getElementById('image1'),
        document.getElementById('image2'),
        document.getElementById('image3'),
        document.getElementById('image4'),
        document.getElementById('image5')
    ];

    const ratingInputs = [
        document.getElementById('rating1'),
        document.getElementById('rating2'),
        document.getElementById('rating3'),
        document.getElementById('rating4'),
        document.getElementById('rating5')
    ];

    // List of available images in the Sample_Images directory
    const allImages = [
        "Sample_Images/Bark.jpg",
        "Sample_Images/Bed headboard fabric_.jpg",
        "Sample_Images/Bedsheets_.jpg",
        "Sample_Images/Blanket.jpg",
        "Sample_Images/Book paper.jpg",
        "Sample_Images/Carpet.jpg",
        "Sample_Images/Clay sculpture_.jpg",
        "Sample_Images/Fabric.jpg",
        "Sample_Images/Fan vent.jpg",
        "Sample_Images/Fan vent(1).jpg",
        "Sample_Images/Fishing line.jpg",
        "Sample_Images/Graphite drawing.jpg",
        "Sample_Images/Hair.jpg",
        "Sample_Images/Hair(1).jpg",
        "Sample_Images/Hair(2).jpg",
        "Sample_Images/Lamp fabric.jpg",
        "Sample_Images/Leather chair.jpg",
        "Sample_Images/Pavement_.jpg",
        "Sample_Images/Pavement.jpg",
        "Sample_Images/Pillowcase fabric_.jpg",
        "Sample_Images/Plastic bag.jpg",
        "Sample_Images/Plastic.jpg",
        "Sample_Images/Rock.jpg",
        "Sample_Images/Rope.jpg",
        "Sample_Images/Sandpaper.jpg",
        "Sample_Images/Sidewalk.jpg",
        "Sample_Images/Skin.jpg",
        "Sample_Images/Skin.png",
        "Sample_Images/Skin(1).jpg",
        "Sample_Images/Stuffed animal fabric.jpg",
        "Sample_Images/Stuffed animal fur.jpg",
        "Sample_Images/Styrofoam_.jpg",
        "Sample_Images/Table.jpg",
        "Sample_Images/Table(1).jpg",
        "Sample_Images/Table(2).jpg",
        "Sample_Images/Towel.jpg",
        "Sample_Images/Towel(1).jpg",
        "Sample_Images/Wall.jpg",
        "Sample_Images/Wall(1).jpg",
        "Sample_Images/Wall(2).jpg",
        "Sample_Images/Wall(3).jpg",
        "Sample_Images/Wall(4).jpg",
        "Sample_Images/Wall(5).jpg",
        "Sample_Images/Wall(6).jpg",
        "Sample_Images/Water bottle.jpg",
        "Sample_Images/Weave bag.jpg",
        "Sample_Images/Weave bag(1).jpg",
        "Sample_Images/Whiteboard.jpg",
        "Sample_Images/Wood.jpg",
        "Sample_Images/Wood(1).jpg",
        "Sample_Images/Wooden sign.jpg"
    ];

    // Fetch IRB.md content and display it
    fetch('IRB.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(markdownContent => {
            document.getElementById('irb-content-placeholder').innerHTML = marked.parse(markdownContent);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            document.getElementById('irb-content-placeholder').innerHTML = '<p>Error loading IRB content. Please try again later.</p>';
        });

    function getRandomUniqueImages(count) {
        const shuffled = [...allImages].sort(() => 0.5 - Math.random()); // Use spread to create a copy
        return shuffled.slice(0, count);
    }

    function displayRandomImages() {
        const selectedImages = getRandomUniqueImages(5);
        imageElements.forEach((imgElement, index) => {
            imgElement.src = selectedImages[index];
            imgElement.alt = `Image ${index + 1}: ${selectedImages[index].split('/').pop()}`;
        });

        // Reset rating inputs and enable them
        ratingInputs.forEach(input => {
            input.value = 1;
            input.disabled = false;
        });
        validationMessages.textContent = ''; // Clear validation messages
    }

    function validateRatings() {
        const ratings = ratingInputs.map(input => parseInt(input.value));
        const uniqueRatings = new Set(ratings);

        // Check range
        for (let i = 0; i < ratings.length; i++) {
            if (ratings[i] < 1 || ratings[i] > 5) {
                validationMessages.textContent = `Error: Rating for Image ${i + 1} must be between 1 and 5.`;
                return false;
            }
        }

        // Check uniqueness
        if (uniqueRatings.size !== ratings.length) {
            validationMessages.textContent = 'Error: All ratings must be unique.';
            return false;
        }

        validationMessages.textContent = ''; // Clear errors if valid
        return true;
    }

    // Consent Logic
    const hasAgreedToIRB = localStorage.getItem('irb_agreed');
    if (hasAgreedToIRB === 'true') {
        consentModal.style.display = 'none';
        surveyContent.style.display = 'block';
        displayRandomImages();
    } else {
        consentModal.style.display = 'flex';
        surveyContent.style.display = 'none';
    }

    consentCheckbox.addEventListener('change', () => {
        continueButton.disabled = !consentCheckbox.checked;
    });

    continueButton.addEventListener('click', () => {
        if (consentCheckbox.checked) {
            localStorage.setItem('irb_agreed', 'true');
            consentModal.style.display = 'none';
            surveyContent.style.display = 'block';
            displayRandomImages();
        }
    });

    // Submit Rankings Button Logic
    submitRankingsButton.addEventListener('click', () => {
        if (validateRatings()) {
            // Play success sound
            successSound.play();

            // Display success message
            successMessage.textContent = 'Rankings submitted successfully!';
            successMessage.style.display = 'block';

            // Hide message after 3 seconds
            setTimeout(() => {
                successMessage.textContent = '';
                successMessage.style.display = 'none';
            }, 3000);

            submitRankingsButton.style.display = 'none';
            getMoreImagesButton.style.display = 'block';
            // Optionally disable inputs after submission
            ratingInputs.forEach(input => {
                input.disabled = true;
            });
        }
    });

    // Get More Images Button Logic
    getMoreImagesButton.addEventListener('click', () => {
        displayRandomImages();
        getMoreImagesButton.style.display = 'none';
        submitRankingsButton.style.display = 'block';
    });
});
