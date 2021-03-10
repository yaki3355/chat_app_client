<template>
  <div class="container">
    <span class="text-info text-left h3">Room: {{room}}</span>
    <button type="button" class="btn btn-outline-info pull-right" v-on:click="leave()">Leave</button>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <input type="text" class="form-control" placeholder="Search participants" v-model="inputSearch"/>
              </div>
            </div>
          </div>
          <div class="inbox_chat">
            <div class="chat_list" v-for="(p, i) in filterParticipants" :key="i">
              <div class="chat_people">
                <div class="chat_ib">
                  <span :class="username === p ? 'text-info': null">{{p}}</span>
                  <span v-if="username !== p" :style="{color: 'green'}">{{participantsTyping[p] ? ' is typing...' : ''}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history" ref="msg_history">
            <div v-for="(m, i) in messages" :key="i">
              <message :msg="m"></message>
            </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input
                type="text"
                class="form-control"
                placeholder="Type a message"
                v-model="message"
                ref="inputType"
              />
              <button class="msg_send_btn" type="button" v-on:click="send()">
                <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from '../components/Message.vue';

export default {
  name: "Room",
  components: { Message },
  data: () => ({
    username: "",
    room: "",
    participants: [],
    participantsTyping: {},
    inputSearch: "",
    message: "",
    messages: []
  }),
  created() {
    this.$socket.removeAllListeners();
    this.setUserDetails();
    this.getRoomParticipants();
    this.onRoomParticipants();
    this.onMessage();
    this.getParticipantsTyping();
    this.onTyping();
    this.welcomeMe();
  },
  computed: {
    filterParticipants() {
      return this.participants.filter((p) =>
          p.toLowerCase().includes(this.inputSearch.toLowerCase())
      );
    }
  },
  methods: {
    getParticipantsTyping() {
      this.$socket.emit('getParticipantsTyping', participantsTyping => {
        this.participantsTyping = participantsTyping;
      });
    },
    onTyping() {
      this.$socket.on('typing', participantsTyping => {
        this.participantsTyping = participantsTyping;
        this.$forceUpdate();
      });
    },
    welcomeMe() {
      this.messages.push({
        isIncomingMsg: true,
        by: 'Admin',
        content: `Welcome ${this.username}`
      });
    },
    onMessage() {
      this.$socket.on('message', message => {
        this.messages.push(message);
      });
    },
    getRoomParticipants() {
      this.$socket.emit('getRoomParticipants', participants => {
        this.participants = participants;
      });
    },
    onRoomParticipants() {
      this.$socket.on('roomParticipants', participants => {
        this.participants = participants;
      });
    },
    send() {
      this.$socket.emit('message', this.message, () => {
        this.messages.push({
          by: this.username,
          content: this.message
        });
        this.message = '';
        this.$refs.inputType.focus();
      });
    },
    leave() {
      this.$router.push('/');
    },
    setUserDetails() {
      this.username = this.$route.params.username;
      this.room = this.$route.params.room;
    }
  },
  watch: {
    messages: function() {
      this.$nextTick(function() {
        const m = this.messages[this.messages.length - 1] || {};
        if (m.by !== this.username) return;
        const msg_history = this.$refs.msg_history;
        msg_history.scrollTop = msg_history.scrollHeight;
      });
    },
    message: function() {
      this.$socket.emit('typing', !!this.message);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat_ib h5 span {
  font-size: 13px;
  float: right;
}
.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto;
}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #17a2b8 none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>