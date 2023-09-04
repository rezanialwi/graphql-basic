const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// Define the User model
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
}, { versionKey: false });

const CompanySchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
}, { versionKey: false });

const User = mongoose.model('User', UserSchema);
const Company = mongoose.model('Company', CompanySchema);

const schema = buildSchema(`
    type User {
        id: ID
        name: String
        age: Int
    }

    type Company {
        id: ID
        name: String
        address: String
        phoneNumber: String
    }

    type Query {
        user(id: ID!): User
        users: [User]
        company(id: ID!): Company
        companies: [Company]
    }

    input CreateUserInput {
        name: String!
        age: Int!
    }

    input CreateCompanyInput {
        name: String!
        address: String!
        phoneNumber: String!
    }

    type Mutation {
        createUser(input: CreateUserInput!): User
        createCompany(input: CreateCompanyInput!): Company
        updateUser(id: ID!, name: String!, age: Int!): User
        updateCompany(id: ID!, name: String!, address: String!, phoneNumber: String!): Company
        deleteUser(id: ID!): User
        deleteCompany(id: ID!): Company
    }
`);

const rootValue = {
    // Resolvers for User
    user: args => User.findById(args.id),
    users: () => User.find(),
    createUser: async args => {
        const { name, age } = args.input;
        const user = new User({
            name,
            age,
        });
        return await user.save();
    },
    updateUser: async args => {
        const { id, name, age } = args;
        const updatedUser = await User.findByIdAndUpdate(id, { name, age }, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    },
    deleteUser: async args => {
        const deletedUser = await User.findByIdAndRemove(args.id);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    },

    // Resolvers for Company
    company: args => Company.findById(args.id),
    companies: () => Company.find(),
    createCompany: async args => {
        const { name, address, phoneNumber } = args.input;
        const company = new Company({
            name,
            address,
            phoneNumber,
        });
        return await company.save();
    },
    updateCompany: async args => {
        const { id, name, address, phoneNumber } = args;
        const updatedCompany = await Company.findByIdAndUpdate(id, { name, address, phoneNumber }, { new: true });
        if (!updatedCompany) {
            throw new Error('Company not found');
        }
        return updatedCompany;
    },
    deleteCompany: async args => {
        const deletedCompany = await Company.findByIdAndRemove(args.id);
        if (!deletedCompany) {
            throw new Error('Company not found');
        }
        return deletedCompany;
    },
};

module.exports = { schema, rootValue };
