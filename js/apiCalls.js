export const BASE_URL = "http://localhost:3000";

export class User {
  constructor(id, name, email, password, role, isActive,isBanned) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
    isActive = false;
    this.isBanned = isBanned;
  }

  static async getAllUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    return await res.json();
  }

  static async getUsersById(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    return await res.json();
  }





  
  static async registerUser(userData) {

    const checkUser = await fetch(`${BASE_URL}/users?email=${userData.email}`);
    const existingUsers = await checkUser.json();
    
    if (existingUsers.length > 0) {
      throw new Error("User with this email already exists");
    }

    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  }




  static async loginUser(userData) {
    try{
      const res = await fetch(`${BASE_URL}/users?email=${userData.email}`);
      
      const users = await res.json();
      if (users.length === 0) {
        throw new Error("User not found");
      }
      const user = users[0];
      if (user.password !== userData.password) {
        throw new Error("Invalid password");
      }
      return user;
    } catch (error) {
      console.error("Error logging in user:", error);
      return null;
    }
  }
    

  static async updateUser(id, updates) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return await res.json();
  }

  static async deleteUser(id) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  }

  static async getUserByCampaignId(campaignId) {
    const res = await Campaign.getCampaignById(campaignId);
    const userId = await res.creatorId;
    const userRes = await fetch(`${BASE_URL}/users/${userId}`);
    const user = await userRes.json();
    return user;
  }
}

export class Campaign {
  constructor(
    id,
    title,
    description,
    goal,
    raised,
    deadline,
    image,
    creatorId,
    isApproved,
    category,
    rewards
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.goal = goal;
    this.raised = raised;
    this.deadline = deadline;
    this.image = image;
    this.creatorId = creatorId;
    this.isApproved = isApproved;
    this.category = category;
    this.rewards = rewards;
  }

  static async getAllCampaigns() {
    const res = await fetch(`${BASE_URL}/campaigns`);
    return await res.json();
  }

  static async getCampaignById(id) {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`);
    return await res.json();
  }

  static async createCampaign(campaignData) {
    const res = await fetch(`${BASE_URL}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaignData),
    });
    return await res.json();
  }

  static async getCampaignsByUser(userId) {
    const res = await fetch(`${BASE_URL}/campaigns?creatorId=${userId}`);
    return await res.json();
  }

  static async getApprovedCampaigns() {
    const res = await fetch(`${BASE_URL}/campaigns?isApproved=true`);
    return await res.json();
  }

  static async searchCampaigns(query) {
    const res = await fetch(
      `${BASE_URL}/campaigns?title=${encodeURIComponent(query)}`
    );
    return await res.json();
  }

  static async filterCampaignsByCategory(category) {
    const res = await fetch(
      `${BASE_URL}/campaigns?category=${category}&_sort=deadline`
    );
    return await res.json();
  }

  static async updateCampaign(id, updates) {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return await res.json();
  }

  static async deleteCampaign(id) {
    const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  }
}

export class Pledge extends User {
  constructor(id, campaignId, userId, amount, rewardId) {
    super(id);
    this.campaignId = campaignId;
    this.userId = userId;
    this.amount = amount;
    this.rewardId = rewardId;
    this.campaign = null;
  }

  // Method to load associated campaign data
  async loadCampaignData() {
    this.campaign = await Campaign.getCampaignById(this.campaignId);
    return this.campaign;
  }

  static async getAllPledges() {
    const res = await fetch(`${BASE_URL}/pledges`);
    return await res.json();
  }

  static async getPledgeById(id) {
    const res = await fetch(`${BASE_URL}/pledges/${id}`);
    return await res.json();
  }

  static async createPledge(pledgeData) {
    const res = await fetch(`${BASE_URL}/pledges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pledgeData),
    });
    return await res.json();
  }

  static async getPledgesByCampaign(campaignId) {
    const res = await fetch(`${BASE_URL}/pledges?campaignId=${campaignId}`);
    return await res.json();
  }

  static async getPledgesByUser(userId) {
    const res = await fetch(`${BASE_URL}/pledges?userId=${userId}`);
    return await res.json();
  }

  static async postCampaignUpdate(updateData) {
    const res = await fetch(`${BASE_URL}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    return await res.json();
  }

  static async getUpdatesByCampaign(campaignId) {
    const res = await fetch(`${BASE_URL}/updates?campaignId=${campaignId}`);
    return await res.json();
  }
}
//==========img to base64
 export async function imageToBase64(img) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject('File reading error');
    reader.readAsDataURL(img);
  });
}
