<template>
  <div>
    <div v-if="msg.isIncomingMsg" class="incoming_msg">
      <div class="incoming_msg_img" :style="msg.by === 'Admin' ? {color: 'red'} : null">{{msg.by}}</div>
      <div class="received_msg">
        <div class="received_withd_msg">
          <p>{{msg.content}}</p>
          <span class="time">{{msg.time}}</span>
        </div>
      </div>
    </div>
    <div v-else class="outgoing_msg">
      <div class="sent_msg">
        <p>{{msg.content}}</p>
        <span class="time">{{msg.time}}</span>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: ["msg"],
  created() {
    this.msg.time = new Date().toLocaleTimeString().slice(0,5);
  }
};
</script>

<style scoped>
.incoming_msg_img {
  display: inline-block;
  width: 50%;
}

.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}

.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}

.received_withd_msg {
  width: 57%;
}

.time {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}

.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}

.sent_msg p {
  background: #17a2b8 none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}

.sent_msg {
  float: right;
  width: 46%;
}
</style>