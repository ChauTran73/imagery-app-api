CREATE TYPE image_category AS ENUM (
    'Animals',
    'Cooking',
    'Outdoor',
    'Nature',
    'People',
    'Art',
    'Architecture',
    'Movie',
    'Music',
    'Design',
    'Workplace',
    'Love',
    'Education',
    'Travel'
)
ALTER TABLE imagery_images
  ADD COLUMN
    style image_category;