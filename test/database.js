var assert = require('assert'); // node.js core module
var mongoose = require('mongoose');
var userInterface = require('../database/UserInterface');
var drinkInterface = require('../database/DrinkInterface');
var guestInterface = require('../database/GuestInterface');
var alcoholInterface = require('../database/AlcoholLevelInterface');
var consumptionInterface = require('../database/ConsumptionInterface');
var priceHistoryInterface = require('../database/PriceHistoryInterface');

// Create db connection
var db;

describe('Database', function(){
    
    before(function(done){
        db = mongoose.connect('mongodb://localhost/stockparty');
        done();
    })
    
    
    describe('User Interface', function(){
        var userToCreate = {'userName': 'UserName', 'password': 'Password', 'name': 'Name', 'role': {'role': 'role'}};
        
        afterEach(function(done){
            userInterface.deleteUser(userToCreate.userName, function error(err){}, function cb(obj){
                done();    
            });
        })
      
        it('should add a user to database', function(done){
            userInterface.addUser(userToCreate.userName, userToCreate.password, userToCreate.name, userToCreate.role, function cb(){

                userInterface.getUser(userToCreate.userName, function error(err){}, function cb(obj){
                    assert.equal(userToCreate.userName, obj.userName);
                    assert.equal(userToCreate.password, obj.password);
                    assert.equal(userToCreate.name, obj.name);
                    assert.deepEqual(userToCreate.role, obj.role);
                    done();}
                );
            });
        })

        it('should change the password of an user', function(done){
            userInterface.addUser(userToCreate.userName, userToCreate.password, userToCreate.name, userToCreate.role, function cb(){

                var userInformation = {'password': 'NewPassword'};
                userInterface.setUserInfo(userToCreate.userName, userInformation, function error(err){}, function cb(obj){
                    userInterface.getUser(userToCreate.userName, function error(err){}, function cb(obj){
                        assert.equal(userInformation.password, obj.password);
                        done();}
                    );}
                );
            });
        })
        
        it('should delete an user', function(done){
            userInterface.addUser(userToCreate.userName, userToCreate.password, userToCreate.name, userToCreate.role, function cb(){

                userInterface.deleteUser(userToCreate.userName, function error(err){}, function cb(obj){
                    userInterface.getUser(userToCreate.userName, function error(err){}, function cb(obj){
                        assert.equal(obj, null);
                        done();}
                    );}
                );
            });
        })
    })
})  