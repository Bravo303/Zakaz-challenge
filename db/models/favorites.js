const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Favorites.init({
    favorites_title: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    favorites_link: DataTypes.STRING,
    favorites_size: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Favorites',
  });
  return Favorites;
};
