<t<template>
  <div class="container">
    <h2>URL Statistics</h2>
    <form @submit.prevent="getStats" class="form">
      <label for="shortUrl">Enter Shortened URL:</label>
      <input
          type="text"
          v-model="shortUrlId"
          id="shortUrl"
          required
          placeholder="http://localhost:3000/url/shortUrlId"
      />
      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? "Loading..." : "Get Stats" }}
      </button>
    </form>

    <div v-if="loading" class="loading-spinner">
      <p>Loading, please wait...</p>
    </div>

    <div v-if="stats && !loading" class="stats">
      <h3>Statistics</h3>
      <p><strong>Original URL:</strong> <a :href="stats.originalUrl" target="_blank">{{ stats.originalUrl }}</a></p>
      <p><strong>Hits:</strong> {{ stats.hits }}</p>
      <p><strong>Expiration:</strong> {{ stats.expiration || 'None' }}</p>

      <h3>Analytics</h3>
      <table v-if="stats.analytics && stats.analytics.length" class="analytics-table">
        <thead>
        <tr>
          <th>Timestamp</th>
          <th>Location</th>
          <th>Browser</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(entry, index) in stats.analytics" :key="index">
          <td>{{ formatTimestamp(entry.timestamp) }}</td>
          <td>{{ entry.location || 'Unknown' }}</td>
          <td>{{ entry.browser || 'Unknown' }}</td>
        </tr>
        </tbody>
      </table>
      <p v-else>No analytics data available.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shortUrlId: '',
      stats: null,
      loading: false, // Loading state
    };
  },
  methods: {
    extractShortUrlId(fullUrl) {
      try {
        const url = new URL(fullUrl);
        return url.pathname.split('/').pop();
      } catch (error) {
        console.error("Invalid URL format:", error);
        return null;
      }
    },
    async getStats() {
      const extractedId = this.extractShortUrlId(this.shortUrlId);
      if (!extractedId) {
        console.error("Invalid URL format. Could not extract ID.");
        return;
      }
      this.loading = true;

      try {
        const response = await this.$http.get(`/url/stats/${extractedId}`);
        this.stats = response.data;
      } catch (error) {
        console.error("Error retrieving stats:", error);
      } finally {
        this.loading = false;
      }
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form, .stats {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

label {
  font-size: 14px;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  margin-bottom: 15px;
}

.submit-button {
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.analytics-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.analytics-table th, .analytics-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.analytics-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.loading-spinner {
  text-align: center;
  color: #555;
  margin-top: 20px;
}
</style>
