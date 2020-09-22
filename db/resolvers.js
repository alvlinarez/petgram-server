const User = require('../models/User');
const Photo = require('../models/Photo');
const Category = require('../models/Category');

const resolvers = {
  Query: {
    // User
    getUser: async (_, {}, ctx) => {
      try {
        const user = await User.findOne({ _id: ctx.user.id });
        if (!user) {
          return new Error('User not found.');
        }
        return user;
      } catch (e) {
        console.log(e);
        return new Error('An unexpected error happened.');
      }
    },
    // Photos
    getPhotos: async () => {
      try {
        const photos = await Photo.find();
        if (!photos) {
          return Error('No photos found.');
        }
        return photos;
      } catch (e) {
        console.log(e);
        return new Error('An unexpected error happened.');
      }
    },
    getPhotosByCategory: async (_, { id }) => {
      try {
        const photos = await Photo.find({ category: id });
        if (!photos) {
          return Error('No photos found.');
        }
        return photos;
      } catch (e) {
        console.log(e);
        return new Error('An unexpected error happened.');
      }
    },
    getPhoto: async (_, { id }) => {
      try {
        const photo = await Photo.findOne({ _id: id });
        if (!photo) {
          return new Error('Photo not found.');
        }
        return photo;
      } catch (e) {
        console.log(e);
        return new Error('An unexpected error happened.');
      }
    },
    // Categories
    getCategories: async () => {
      try {
        const categories = await Category.find();
        if (!categories) {
          return new Error('Categories not found.');
        }
        return categories;
      } catch (e) {
        console.log(e);
        return new Error('An unexpected error happened.');
      }
    }
  },

  Mutation: {
    // Photos
    createPhoto: async (_, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('Invalid token. Please sign in.');
      }
      // Photo category, src and owner
      const { category: categoryId, src } = input;
      try {
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
          return new Error('Category not found');
        }
        let photo = new Photo({
          category: categoryId,
          user: ctx.user.id,
          src
        });
        photo = await photo.save();
        return photo.toJSON();
      } catch (e) {
        return new Error('An unexpected error happened.');
      }
    },
    likePhoto: async (_, { id }, ctx) => {
      if (!ctx.user) {
        throw new Error('Invalid token. Please sign in.');
      }
      try {
        let user = await User.findOne({ _id: ctx.user.id });
        if (!user) {
          return new Error('User not found');
        }
        if (user.favorites.find((favorite) => favorite.id === id)) {
          return new Error('Photo already liked by user');
        }
        user.favorites.push(id);
        await user.save();

        const photo = await Photo.findOneAndUpdate(
          { _id: id },
          {
            $inc: {
              likes: 1
            }
          },
          { new: true }
        );
        if (!photo) {
          return new Error('Photo not found.');
        }
        return photo;
      } catch (e) {
        return new Error('An unexpected error happened.');
      }
    },
    unlikePhoto: async (_, { id }, ctx) => {
      if (!ctx.user) {
        throw new Error('Invalid token. Please sign in.');
      }
      try {
        const user = await User.findOne({ _id: ctx.user.id });
        if (!user) {
          return new Error('User not found');
        }
        if (!user.favorites.find((favorite) => favorite.id === id)) {
          return new Error('Photo is not liked yet.');
        }
        user.favorites = user.favorites.filter(
          (favorite) => favorite.id !== id
        );
        await user.save();

        const photo = await Photo.findOneAndUpdate(
          { _id: id },
          {
            $inc: {
              likes: -1
            }
          },
          { new: true }
        );
        if (!photo) {
          return new Error('Photo not found.');
        }
        return photo;
      } catch (e) {
        return new Error('An unexpected error happened.');
      }
    },
    // Categories
    createCategory: async (_, { input }, ctx) => {
      if (!ctx.user) {
        throw new Error('Invalid token. Please sign in.');
      }
      const { name, emoji, cover } = input;
      try {
        let category = new Category({
          name,
          emoji,
          cover
        });
        category = await category.save();
        return category.toJSON();
      } catch (e) {
        return new Error('An unexpected error happened.');
      }
    }
  }
};

module.exports = resolvers;
