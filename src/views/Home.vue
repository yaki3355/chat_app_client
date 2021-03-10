<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="#17a2b8">
                <v-toolbar-title>Chat app</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Username"
                    type="text"
                    v-model="username"
                  ></v-text-field>
                  <v-select
                    :items="rooms"
                    label="Room"
                    v-model="room"
                    >
                    <template slot="item" slot-scope="data">
                      {{ data.item }} ({{roomsCounters[data.item]}})
                    </template>
                    </v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#17a2b8" class="white--text" @click="joinRoom"
                  >Join chat</v-btn
                >
              </v-card-actions>
            </v-card>
          <div class="alert alert-danger" role="alert" v-if="error">
            {{ error }}
          </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <div class="bg-light py-4">
      <div class="container text-center">
        <p class="text-muted mb-0 py-2">Yaki {{ year }}</p>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    username: "",
    room: "",
    rooms: [],
    roomsCounters: {},
    maxParticipantsEachRoom: 0,
    year: 0,
    error: "",
  }),
  methods: {
    joinRoom() {
      if (!this.username) return this.error = 'Username is empty';
      if (!this.room) return this.error = 'Room is empty';
      if (this.username.toLowerCase().includes('admin')) return this.error = "Username must not contain 'admin'";
      if (this.roomsCounters[this.room] >= this.maxParticipantsEachRoom) return this.error = `This room is full, max participants: ${this.maxParticipantsEachRoom}`;
      this.$socket.emit('joinRoom', this.username, this.room, msg => {
        if (msg) return this.error = msg;
        this.$router.push({name: 'Room', params: {username: this.username, room: this.room}});
      });
    },
    getRoomsCounters() {
      this.$socket.emit('getRoomsCounters', ({counters, maxParticipantsEachRoom}) => {
        this.rooms = Object.keys(counters);
        this.maxParticipantsEachRoom = maxParticipantsEachRoom;
        this.setRoomsCounters(counters);
      });
    },
    onRoomsCounters() {
      this.$socket.on('roomsCounters', ({counters}) => {
        this.setRoomsCounters(counters);
      });
    },
    setRoomsCounters(counters) {
      Object.keys(counters).forEach(k => {
        if (counters[k] >= this.maxParticipantsEachRoom) counters[k] = 'Full';
      });
      this.roomsCounters = counters;
    }
  },
  created() {
    this.year = new Date().getFullYear();
    this.getRoomsCounters();
    this.onRoomsCounters();
  }
};
</script>
