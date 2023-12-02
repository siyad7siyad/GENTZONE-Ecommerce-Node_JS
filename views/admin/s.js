<div class="col-lg-3">

<div class="card mb-4">
    <div class="card-body">

        <div class="images-container">
            <!-- Add Product Images Here -->
        </div>
        <button type="button" class="btn btn-primary mb-3" onclick="addImage()">Add Image</button>

        <script>
            let imageCount = 0;

            function addImage() {
                imageCount++;
                const container = document.querySelector('.images-container');
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('mb-4');
                imageDiv.innerHTML = `
                    <label class="form-label">Image ${imageCount}</label>
                    <div class="image-container">
                        <img src="" alt="" id="image-preview${imageCount}">
                    </div>
                    <input class="form-control" name="image" type="file" onchange="displayImage(${imageCount}, this)" multiple="multiple">
                `;
                container.appendChild(imageDiv);
            }

            function displayImage(imageNumber, input) {
                const preview = document.getElementById(`image-preview${imageNumber}`);

                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        preview.src = e.target.result;
                    };
                    reader.readAsDataURL(input.files[0]);
                } else {
                    preview.src = '';
                }
            }
        </script>







    </div>
</div>
<div id="invalid">
    <% if (typeof error !=='undefined' && error) { %>
        <p style="color: rgb(144, 5, 5);" id="message">
            <%= error %>
        </p>
        <% } %>
                      
</div>
</div>