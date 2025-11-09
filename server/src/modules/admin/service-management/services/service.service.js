const ServiceModel = require("../models/service.model");
const { StatusCodes } = require("http-status-codes");

const Services = {
  async createService(serviceData) {
    try {
      // Create a new service instance
      const newService = new ServiceModel(serviceData);

      // Save the service to the database
      return await newService.save();
    } catch (error) {
      console.error("Error creating service: ", error);
      throw new Error("Error creating service: " + error.message);
    }
  },

  async getAllServices() {
    try {
      // Fetch all service from the database
      return await ServiceModel.find().select("-__v -tokens");
    } catch (error) {
      console.error("Error fetching all service: ", error);
      throw new Error("Error fetching all service: " + error.message);
    }
  },

  async getServiceById(serviceId) {
    try {
      return await ServiceModel.findById(serviceId);
    } catch (error) {
      console.error("Error fetching service by ID: ", error);
      throw new Error("Error fetching service by ID: " + error.message);
    }
  },

  async updateService(serviceId, serviceData) {
    try {
      return await ServiceModel.findByIdAndUpdate(serviceId, serviceData, {
        new: true,
        runValidation: true,
      });
    } catch (error) {
      console.error("Error update permission: ", error);
      throw new Error("Error update permission: " + error.message);
    }
  },
};

module.exports = Services;
