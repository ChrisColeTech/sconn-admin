#!/usr/bin/env node

/**
 * Test script to verify the complete authentication flow
 * Tests: login, token validation, refresh, and logout
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001';
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

async function testAuthFlow() {
  console.log('🔐 Testing SConnect Admin Authentication Flow\n');

  try {
    // Test 1: Login
    console.log('1. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, TEST_CREDENTIALS);
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed: ' + JSON.stringify(loginResponse.data));
    }
    
    const { token, refreshToken, user } = loginResponse.data.data;
    console.log('✅ Login successful');
    console.log(`   User: ${user.username} (${user.email})`);
    console.log(`   Roles: ${user.roles.join(', ')}`);
    console.log(`   Permissions: ${user.permissions.length} permissions`);
    console.log(`   Token length: ${token.length}`);
    console.log(`   Refresh token: ${refreshToken}\n`);

    // Test 2: Validate token with /me endpoint
    console.log('2. Testing token validation...');
    const meResponse = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!meResponse.data.success) {
      throw new Error('Token validation failed: ' + JSON.stringify(meResponse.data));
    }
    
    console.log('✅ Token validation successful');
    console.log(`   Authenticated as: ${meResponse.data.data.user.username}\n`);

    // Test 3: Refresh token
    console.log('3. Testing token refresh...');
    const refreshResponse = await axios.post(`${API_BASE}/api/auth/refresh`, {
      refreshToken
    });
    
    if (!refreshResponse.data.success) {
      throw new Error('Token refresh failed: ' + JSON.stringify(refreshResponse.data));
    }
    
    const newToken = refreshResponse.data.data.token;
    console.log('✅ Token refresh successful');
    console.log(`   New token length: ${newToken.length}\n`);

    // Test 4: Validate new token
    console.log('4. Testing new token validation...');
    const newMeResponse = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${newToken}`
      }
    });
    
    if (!newMeResponse.data.success) {
      throw new Error('New token validation failed: ' + JSON.stringify(newMeResponse.data));
    }
    
    console.log('✅ New token validation successful\n');

    // Test 5: Logout
    console.log('5. Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE}/api/auth/logout`, {
      refreshToken
    }, {
      headers: {
        Authorization: `Bearer ${newToken}`
      }
    });
    
    if (!logoutResponse.data.success) {
      throw new Error('Logout failed: ' + JSON.stringify(logoutResponse.data));
    }
    
    console.log('✅ Logout successful\n');

    // Test 6: Verify token is invalidated after logout
    console.log('6. Testing token invalidation after logout...');
    try {
      await axios.post(`${API_BASE}/api/auth/refresh`, {
        refreshToken
      });
      throw new Error('Refresh token should be invalidated after logout');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Refresh token correctly invalidated after logout\n');
      } else {
        throw error;
      }
    }

    // Test 7: Test invalid credentials
    console.log('7. Testing invalid credentials...');
    try {
      await axios.post(`${API_BASE}/api/auth/login`, {
        username: 'admin',
        password: 'wrongpassword'
      });
      throw new Error('Login should fail with invalid credentials');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid credentials correctly rejected\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 All authentication tests passed!');
    console.log('\n📊 Test Results:');
    console.log('   ✅ Login with valid credentials');
    console.log('   ✅ JWT token validation');
    console.log('   ✅ Token refresh mechanism');
    console.log('   ✅ New token validation');
    console.log('   ✅ Logout functionality');
    console.log('   ✅ Token invalidation after logout');
    console.log('   ✅ Invalid credentials rejection');
    console.log('\n🔒 Authentication system is fully functional!');

  } catch (error) {
    console.error('❌ Authentication test failed:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

testAuthFlow();